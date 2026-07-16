from django.db import connection
import redis

from django.conf import settings


def get_health_status():
    database = "disconnected"
    redis_status = "disconnected"

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        database = "connected"
    except Exception:
        pass

    try:
        client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            socket_connect_timeout=2,
        )
        client.ping()
        redis_status = "connected"
    except Exception:
        pass

    return {
    "status": "healthy",
    "services": {
        "database": database,
        "redis": redis_status,
    },
    "version": "1.0.0",
}