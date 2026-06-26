from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, PlainTextResponse
from sqlalchemy.orm import Session
from app.api import deps
from app.models.project import Project
from app.models.review import Review, ReviewResult
from app.models.user import User
from app.schemas.review import CodeUpload, ReviewOut
from app.services.static_analysis import analyze_file_content
from app.ai.agent_supervisor import run_multi_agent_review
from app.services.report_generator import generate_markdown_report, generate_html_report

router = APIRouter()

@router.post("/", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def trigger_code_review(
    upload: CodeUpload,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Find or create a default project if none is specified
    project_id = upload.project_id
    if not project_id:
        # Check if user has any existing projects, otherwise create one
        first_proj = db.query(Project).filter(Project.owner_id == current_user.id).first()
        if first_proj:
            project_id = first_proj.id
        else:
            db_project = Project(
                name="Default Workspace",
                description="Auto-generated review workspace",
                owner_id=current_user.id
            )
            db.add(db_project)
            db.commit()
            db.refresh(db_project)
            project_id = db_project.id

    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 1. Run Static Analysis Linter
    static_findings = analyze_file_content(upload.file_name, upload.code_content)

    # 2. Run Multi-Agent Review Pipeline
    review_summary = run_multi_agent_review(upload.file_name, upload.code_content, static_findings)

    # 3. Save Review metadata in DB
    db_review = Review(
        project_id=project_id,
        status="COMPLETED",
        overall_score=review_summary["overall_score"],
        security_score=review_summary["security_score"],
        performance_score=review_summary["performance_score"],
        bugs_score=review_summary["bugs_score"],
        complexity_score=review_summary["complexity_score"],
        doc_score=review_summary["doc_score"]
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # 4. Save individual audit results
    for issue in review_summary["issues"]:
        db_result = ReviewResult(
            review_id=db_review.id,
            file_path=issue.get("file_path", upload.file_name),
            line_number=issue.get("line_number"),
            category=issue.get("category", "code"),
            severity=issue.get("severity", "info"),
            message=issue.get("message", ""),
            original_code=issue.get("original_code"),
            suggested_code=issue.get("suggested_code")
        )
        db.add(db_result)
        
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/", response_model=List[ReviewOut])
def read_reviews(
    project_id: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(Review).join(Project).filter(Project.owner_id == current_user.id)
    if project_id:
        query = query.filter(Review.project_id == project_id)
    return query.order_by(Review.created_at.desc()).all()

@router.get("/{review_id}", response_model=ReviewOut)
def read_review(
    review_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    review = db.query(Review).join(Project).filter(
        Review.id == review_id,
        Project.owner_id == current_user.id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review report not found")
    return review

@router.get("/{review_id}/markdown", response_class=PlainTextResponse)
def get_review_markdown(
    review_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    review = db.query(Review).join(Project).filter(
        Review.id == review_id,
        Project.owner_id == current_user.id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    # Prepare serializable object for report generator
    review_dict = {
        "overall_score": review.overall_score,
        "security_score": review.security_score,
        "performance_score": review.performance_score,
        "bugs_score": review.bugs_score,
        "complexity_score": review.complexity_score,
        "doc_score": review.doc_score,
        "issues": [
            {
                "file_path": r.file_path,
                "line_number": r.line_number,
                "category": r.category,
                "severity": r.severity,
                "message": r.message,
                "original_code": r.original_code,
                "suggested_code": r.suggested_code
            } for r in review.results
        ]
    }
    
    report_md = generate_markdown_report(review_dict, review.project.name)
    return report_md

@router.get("/{review_id}/html", response_class=HTMLResponse)
def get_review_html(
    review_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    review = db.query(Review).join(Project).filter(
        Review.id == review_id,
        Project.owner_id == current_user.id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review_dict = {
        "overall_score": review.overall_score,
        "security_score": review.security_score,
        "performance_score": review.performance_score,
        "bugs_score": review.bugs_score,
        "complexity_score": review.complexity_score,
        "doc_score": review.doc_score,
        "issues": [
            {
                "file_path": r.file_path,
                "line_number": r.line_number,
                "category": r.category,
                "severity": r.severity,
                "message": r.message,
                "original_code": r.original_code,
                "suggested_code": r.suggested_code
            } for r in review.results
        ]
    }
    
    report_html = generate_html_report(review_dict, review.project.name)
    return report_html
