from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.game,name='game'),
    path('ms',views.game_make_step,name='ms')
]
