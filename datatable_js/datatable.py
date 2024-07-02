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


def select(request):
    query_data = request.GET.get("query", "")  # Get the search query
    page = round(float(request.GET.get("page", 1)))  # Get the requested page number
    page_size = ELEMENTS_PER_PAGE  # Number of options to return per page
    offset = (page - 1) * page_size  # Start index for the query
    lg_center_cd = request.session["lg_center_cd"]

    # query data
    data = []
    total_count = 0

    results = [{"id": "", "text": ""}] + [
        {"id": row[0], "text": row[1]} for row in data
    ]

    # Calculate total pages
    total_pages = ceil((total_count + 1) / page_size)

    response = {
        "results": results,
        "total_pages": total_pages,
        "current_page": page,
    }
    return JsonResponse(response)
