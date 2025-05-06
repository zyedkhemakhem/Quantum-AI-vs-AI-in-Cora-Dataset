from django.urls import path
from .views import (
    train_view,
    visualize_before,
    visualize_after,

    # générique de mise à jour
    update_code_gcn,
    update_code_gat,
    update_code_gcn_augmented,
    update_code_gat_augmented,
    update_code_qgcn,
    update_code_qgat,
    update_code_qgcn_augmented,
    update_code_qgat_augmented,

    # récupération du code
    get_code_gcn,
    get_code_gat,
    get_code_gcn_augmented,
    get_code_gat_augmented,
    get_code_qgcn,
    get_code_qgat,
    get_code_qgcn_augmented,
    get_code_qgat_augmented,
)

urlpatterns = [
    # exécution et visualisations
    path('train/', train_view),
    path('visualize/before/', visualize_before),
    path('visualize/after/', visualize_after),

    # mise à jour PUT pour chacun des 8 trainers
    path('code/update/gcn/', update_code_gcn),
    path('code/update/gat/', update_code_gat),
    path('code/update/gcn_augmented/', update_code_gcn_augmented),
    path('code/update/gat_augmented/', update_code_gat_augmented),
    path('code/update/qgcn/', update_code_qgcn),
    path('code/update/qgat/', update_code_qgat),
    path('code/update/qgcn_augmented/', update_code_qgcn_augmented),
    path('code/update/qgat_augmented/', update_code_qgat_augmented),

    # récupération GET du code pour chacun des 8 trainers
    path('code/get/gcn/', get_code_gcn),
    path('code/get/gat/', get_code_gat),
    path('code/get/gcn_augmented/', get_code_gcn_augmented),
    path('code/get/gat_augmented/', get_code_gat_augmented),
    path('code/get/qgcn/', get_code_qgcn),
    path('code/get/qgat/', get_code_qgat),
    path('code/get/qgcn_augmented/', get_code_qgcn_augmented),
    path('code/get/qgat_augmented/', get_code_qgat_augmented),
]
