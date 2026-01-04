from pydantic import BaseModel, Field

class ContentCheckRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    threshold: float = Field(0.5, ge=0, le=1)