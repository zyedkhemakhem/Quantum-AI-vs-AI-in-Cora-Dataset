from django.urls import path
from .views import update_code_gcn, update_code_gat
from .views import (
    train_view,
    visualize_before,
    visualize_after
)
from .views import update_code
from .views import get_code_gcn
from .views import get_code_gat



urlpatterns = [
    path('train/', train_view),
    path('visualize/before/', visualize_before),
    path('visualize/after/', visualize_after),
    path('code/update/', update_code),
    path('code/update/gcn/', update_code_gcn),
    path('code/update/gat/', update_code_gat),
    path('code/get/gcn/', get_code_gcn),
    path('code/get/gat/', get_code_gat),



]
