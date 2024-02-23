from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from datetime import datetime
def view_title(req):
    print("получен запрос")
    return JsonResponse({
        "message": datetime.now().strftime("%H:%M:%S")
    })