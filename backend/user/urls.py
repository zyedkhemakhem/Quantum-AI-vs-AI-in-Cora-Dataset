from django.urls import path
from .views import RegisterView, LoginView, UserProfile, UserDetailView, DeveloperDashboard, UserDashboard, TestAdminView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserProfile.as_view(), name='user-profile'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('developer/dashboard/', DeveloperDashboard.as_view(), name='developer-dashboard'),
    path('user/dashboard/', UserDashboard.as_view(), name='user-dashboard'),
    path('test-admin/', TestAdminView.as_view()),

]
   
