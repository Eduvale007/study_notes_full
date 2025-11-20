from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('api/create_summary/', views.create_summary, name='create_summary'),
    path('api/update_summary/<int:pk>/', views.update_summary, name='update_summary'),
    path('api/delete_summary/<int:pk>/', views.delete_summary, name='delete_summary'),
]