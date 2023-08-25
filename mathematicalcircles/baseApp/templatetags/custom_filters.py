from django import template
from ..models import *

register = template.Library()

@register.filter
def count_matching_resources(condition):
    count = ResourcesByExam.objects.filter(exam_Name=condition).count()
    return count

@register.filter
def show_matching_resources(exam):
    resources = ResourcesByExam.objects.filter(exam_Name=exam).order_by("-sno")[:6]
    return resources