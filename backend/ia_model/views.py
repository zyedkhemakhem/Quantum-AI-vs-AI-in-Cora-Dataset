# backend/ia_model/views.py

import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Trainers « classiques »
from .trainers.gcn_trainer import run_gcn
from .trainers.gat_trainer import run_gat

# Trainers pour Cora augmenté
from .trainers.gcn_trainer_augmented import run_gcn_augmented
from .trainers.gat_trainer_augmented import run_gat_augmented

# Trainers quantiques pour Cora original
from .trainers.qgcn_trainer import run_qgcn
from .trainers.qgat_trainer import run_qgat

# Trainers quantiques pour Cora augmenté
from .trainers.qgcn_trainer_augmented import run_qgcn_augmented
from .trainers.qgat_trainer_augmented import run_qgat_augmented

# Visualisations
from .visuals.before_training import plot_graph, plot_node_degrees
from .visuals.after_training import (
    plot_tsne_before_training,
    plot_tsne_after_training,
    plot_accuracy_by_degree,
)

def train_view(request):
    model_type = request.GET.get("model", "gcn")
    if model_type == "gcn":
        result = run_gcn()
    elif model_type == "gat":
        result = run_gat()
    elif model_type == "gcn_augmented":
        result = run_gcn_augmented()
    elif model_type == "gat_augmented":
        result = run_gat_augmented()
    elif model_type == "qgcn":
        result = run_qgcn()
    elif model_type == "qgat":
        result = run_qgat()
    elif model_type == "qgcn_augmented":
        result = run_qgcn_augmented()
    elif model_type == "qgat_augmented":
        result = run_qgat_augmented()
    else:
        return JsonResponse(
            {"error": f"Modèle inconnu : {model_type}"}, status=400
        )
    return JsonResponse(result)

def visualize_before(request):
    return JsonResponse({
        "graph": plot_graph(),
        "degrees": plot_node_degrees()
    })

def visualize_after(request):
    return JsonResponse({
        "tsne_before": plot_tsne_before_training(),
        "tsne_after": plot_tsne_after_training(),
        "accuracy_degree": plot_accuracy_by_degree()
    })

# —— Helpers pour PUT / GET des scripts ——

def _update_code_generic(request, filename):
    if request.method != "PUT":
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)
    try:
        data = json.loads(request.body)
        code = data.get("code", "").strip()
        if not code:
            return JsonResponse({"error": "Le code ne peut pas être vide."}, status=400)
        filepath = os.path.join(os.path.dirname(__file__), "trainers", filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(code)
        return JsonResponse({"status": "ok", "message": f"{filename} mis à jour avec succès"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def _get_code_generic(request, filename):
    try:
        filepath = os.path.join(os.path.dirname(__file__), "trainers", filename)
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        return JsonResponse({"code": code})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# —— 8 endpoints PUT pour éditer chaque trainer —— 
@csrf_exempt
def update_code_gcn(request):
    return _update_code_generic(request, "gcn_trainer.py")

@csrf_exempt
def update_code_gat(request):
    return _update_code_generic(request, "gat_trainer.py")

@csrf_exempt
def update_code_gcn_augmented(request):
    return _update_code_generic(request, "gcn_trainer_augmented.py")

@csrf_exempt
def update_code_gat_augmented(request):
    return _update_code_generic(request, "gat_trainer_augmented.py")

@csrf_exempt
def update_code_qgcn(request):
    return _update_code_generic(request, "qgcn_trainer.py")

@csrf_exempt
def update_code_qgat(request):
    return _update_code_generic(request, "qgat_trainer.py")

@csrf_exempt
def update_code_qgcn_augmented(request):
    return _update_code_generic(request, "qgcn_trainer_augmented.py")

@csrf_exempt
def update_code_qgat_augmented(request):
    return _update_code_generic(request, "qgat_trainer_augmented.py")

# —— 8 endpoints GET pour récupérer chaque trainer —— 
def get_code_gcn(request):
    return _get_code_generic(request, "gcn_trainer.py")

def get_code_gat(request):
    return _get_code_generic(request, "gat_trainer.py")

def get_code_gcn_augmented(request):
    return _get_code_generic(request, "gcn_trainer_augmented.py")

def get_code_gat_augmented(request):
    return _get_code_generic(request, "gat_trainer_augmented.py")

def get_code_qgcn(request):
    return _get_code_generic(request, "qgcn_trainer.py")

def get_code_qgat(request):
    return _get_code_generic(request, "qgat_trainer.py")

def get_code_qgcn_augmented(request):
    return _get_code_generic(request, "qgcn_trainer_augmented.py")

def get_code_qgat_augmented(request):
    return _get_code_generic(request, "qgat_trainer_augmented.py")
