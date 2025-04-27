from django.http import JsonResponse
from .trainers.gcn_trainer import run_gcn
from .trainers.gat_trainer import run_gat
from .visuals.before_training import plot_graph, plot_node_degrees
from .visuals.after_training import plot_tsne_before_training, plot_tsne_after_training, plot_accuracy_by_degree
import os
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json


def train_view(request):
    model_type = request.GET.get("model", "gcn")

    if model_type == "gat":
        result = run_gat()
    else:
        result = run_gcn()

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

@csrf_exempt
def update_code(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            code = data.get("code")
            if code:
                # Chemin du fichier Python à modifier (ex : gcn_trainer.py)
                filepath = os.path.join(os.path.dirname(__file__), "trainers", "gcn_trainer.py")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(code)
                return JsonResponse({"status": "ok", "message": "Code mis à jour avec succès"})
            else:
                return JsonResponse({"error": "Aucun code fourni"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)
import os
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def update_code_gcn(request):
    return _update_code_generic(request, "gcn_trainer.py")

@csrf_exempt
def update_code_gat(request):
    return _update_code_generic(request, "gat_trainer.py")

def _update_code_generic(request, filename):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            code = data.get("code")
            if code and code.strip():
                filepath = os.path.join(os.path.dirname(__file__), "trainers", filename)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(code)
                return JsonResponse({"status": "ok", "message": f"{filename} mis à jour avec succès"})
            else:
                return JsonResponse({"error": "Le code ne peut pas être vide."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)
@csrf_exempt
def get_code_gcn(request):
    filepath = os.path.join(os.path.dirname(__file__), "trainers", "gcn_trainer.py")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        return JsonResponse({ "code": code })
    except Exception as e:
        return JsonResponse({ "error": str(e) }, status=500)
@csrf_exempt
def get_code_gat(request):
    filepath = os.path.join(os.path.dirname(__file__), "trainers", "gcn_trainer.py")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        return JsonResponse({ "code": code })
    except Exception as e:
        return JsonResponse({ "error": str(e) }, status=500)

