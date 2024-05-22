def product_master_view_filter(request):
    length = int(request.GET.get("length", ELEMENTS_PER_PAGE))  # limit
    page_number = int(request.GET.get("page", 1))  # offset

    order_column_name = request.GET.get("order_name", None) or None
    order_direction = request.GET.get("order_direction", "") or ""

    search_data = SearchProductMasterForm(request.GET).data

    data = []
    total_records = 0

    response = {
        "draw": int(request.GET.get("draw", 1)),
        "recordsTotal": total_records,
        "recordsFiltered": total_records,
        "data": data,
    }

    return JsonResponse(response)
