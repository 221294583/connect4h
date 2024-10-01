from django.http import HttpResponse,JsonResponse
from django.shortcuts import render
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from . import resource


def startpage(request):
    return render(request,'index.html',resource.get_startpage_button())

def hello(request):
    return render(request,'hello.html',{})