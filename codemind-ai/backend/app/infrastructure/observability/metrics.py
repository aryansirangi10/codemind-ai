import time
from typing import Dict, Any

class MetricsCollector:
    def __init__(self):
        self._counters: Dict[str, int] = {}
        self._durations: Dict[str, float] = {}

    def increment(self, metric: str, value: int = 1):
        self._counters[metric] = self._counters.get(metric, 0) + value

    def record_duration(self, metric: str, duration_ms: float):
        self._durations[metric] = duration_ms

    def get_summary(self) -> Dict[str, Any]:
        return {
            "counters": self._counters,
            "durations_ms": self._durations
        }

metrics = MetricsCollector()
