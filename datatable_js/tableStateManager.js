// Utility functions for managing table state with URL parameters
const TableStateManager = {
    // Update URL with search parameters
    updateURL: function(params) {
        const url = new URL(window.location.href);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    },

    // Get parameters from URL
    getURLParams: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    },

    // Restore form values from URL parameters
    restoreFormValues: function(formId, params) {
        Object.keys(params).forEach(key => {
            const input = document.querySelector(`#${formId} [name="${key}"]`);
            if (input) {
                input.value = params[key];
            }
        });
    },

    // Clear form values
    clearFormValues: function(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    },

    // Initialize table with URL parameters
    initializeTable: function(table, formId, searchParams, options = {}) {
        const urlParams = this.getURLParams();

        // Restore form values if any
        if (Object.keys(urlParams).length > 0) {
            this.restoreFormValues(formId, urlParams);
            Object.assign(searchParams, urlParams);
        }

        // Set up search button click handler if not using input change
        if (!options.useInputChange) {
            $(`#${formId} #btn-search`).click(function(event) {
                const formData = new FormData(document.getElementById(formId));
                Object.keys(searchParams).forEach(key => delete searchParams[key]);

                for (const pair of formData.entries()) {
                    if (pair[1]) {
                        searchParams[pair[0]] = pair[1];
                    }
                }

                // Keep current page and length
                const currentPage = urlParams.page || 1;
                searchParams.page = currentPage;
                searchParams.length = urlParams.length || table.page.len();

                TableStateManager.updateURL(searchParams);
                table.ajax.reload();
            });
        }

        // Set up input change handler if using input change
        if (options.useInputChange) {
            const inputSelector = options.inputSelector || 'input, select';
            $(`#${formId} ${inputSelector}`).on('change', function() {
                const formData = new FormData(document.getElementById(formId));
                Object.keys(searchParams).forEach(key => delete searchParams[key]);

                for (const pair of formData.entries()) {
                    if (pair[1]) {
                        searchParams[pair[0]] = pair[1];
                    }
                }

                // Keep current page and length
                const currentPage = urlParams.page || 1;
                searchParams.page = currentPage;
                searchParams.length = urlParams.length || table.page.len();

                TableStateManager.updateURL(searchParams);
                table.ajax.reload();
            });
        }

        // Handle page change
        table.on('page.dt', function() {
            const pageInfo = table.page.info();
            searchParams.page = pageInfo.page + 1;
            searchParams.length = pageInfo.length;
            TableStateManager.updateURL(searchParams);
        });

        // Handle page length change
        table.on('length.dt', function(e, settings, len) {
            // Keep current page when changing page length
            const currentPage = urlParams.page || 1;
            searchParams.page = currentPage;
            searchParams.length = len;
            TableStateManager.updateURL(searchParams);
        });

        // Restore page from URL params
        if (urlParams.page && urlParams.length) {
            const page = parseInt(urlParams.page) - 1;
            const length = parseInt(urlParams.length);
            table.page(page).draw('page');
            table.page.len(length).draw();
        }

        // Handle clear button
        $(`#${formId} button[type='reset']`).click(function() {
            // Clear form
            TableStateManager.clearFormValues(formId);

            // Clear all search parameters
            Object.keys(searchParams).forEach(key => delete searchParams[key]);

            // Reset URL to initial state
            window.history.replaceState({}, '', window.location.pathname);

            // Reset table to first page
            table.page(0).draw('page');

            // Reload data
            table.ajax.reload();
        });
    }
};
