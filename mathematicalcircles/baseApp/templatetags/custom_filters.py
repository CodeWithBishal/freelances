from django import template
from ..models import *

register = template.Library()

@register.filter
def count_matching_resources(condition):
    count = ResourcesByExam.objects.filter(exam_Name=condition).count()
    return count