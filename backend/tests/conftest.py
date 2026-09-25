import pytest
from app.db.session import sync_engine, Base

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=sync_engine)
    yield
