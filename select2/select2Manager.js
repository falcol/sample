// Utility functions for managing Select2 with AJAX
const Select2Manager = {
    // Initialize Select2 with AJAX
    initializeSelect2: function(selector, options = {}) {
        const defaultOptions = {
            theme: "bootstrap-5",
            selectionCssClass: 'form-control',
            width: '100%',
            dropdownParent: $('body'),
            allowClear: true,
            minimumInputLength: 0,
            ajax: {
                url: options.url || '',
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        search: params.term,
                        page: params.page || 1,
                        length: 20,
                        draw: 1,
                        start: 0,
                        [options.fieldName || '']: params.term
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1;
                    console.log(data);

                    return {
                        results: data.data.map(item => ({
                            id: item[options.idField || 'id'],
                            text: item[options.textField || 'text']
                        })),
                        pagination: {
                            more: data.data.length === 20
                        }
                    };
                },
                cache: true
            }
        };

        // Merge default options with custom options
        const mergedOptions = { ...defaultOptions, ...options };

        // Remove ajax options from merged options to avoid duplication
        delete mergedOptions.url;
        delete mergedOptions.fieldName;
        delete mergedOptions.idField;
        delete mergedOptions.textField;

        // Add CSS for dropdown width
        const style = document.createElement('style');
        style.textContent = `
            .select2-results__option {
                padding: 6px 12px;
                white-space: nowrap;
            }
            .select2-container--bootstrap-5 .select2-dropdown {
                border-color: #dee2e6;
            }
        `;
        document.head.appendChild(style);

        // Initialize Select2
        $(selector).select2(mergedOptions);

        // Fix dropdown width to match select width
        $(selector).on('select2:open', function() {
            const selectWidth = $(selector).next('.select2-container').width();
            $('.select2-dropdown').css('width', selectWidth + 'px');
        });
    },

    // Initialize Select2 for static select elements
    initializeStaticSelect2: function(selector, options = {}) {
        const defaultOptions = {
            theme: "bootstrap-5",
            selectionCssClass: 'form-control',
            width: '100%',
            dropdownParent: $('body'),
            allowClear: true,
            placeholder: options.placeholder || '',
            language: {
                noResults: function() {
                    return "";
                }
            }
        };

        // Merge default options with custom options
        const mergedOptions = { ...defaultOptions, ...options };

        // Add CSS for dropdown width
        const style = document.createElement('style');
        style.textContent = `
            .select2-results__option {
                padding: 6px 12px;
                white-space: nowrap;
            }
            .select2-container--bootstrap-5 .select2-dropdown {
                border-color: #dee2e6;
            }
        `;
        document.head.appendChild(style);

        // Initialize Select2
        $(selector).select2(mergedOptions);

        // Fix dropdown width to match select width
        $(selector).on('select2:open', function() {
            const selectWidth = $(selector).next('.select2-container').width();
            $('.select2-dropdown').css('width', selectWidth + 'px');
        });
    },

    // Initialize multiple Select2 at once
    initializeMultipleSelect2: function(configs) {
        configs.forEach(config => {
            this.initializeSelect2(config.selector, config.options);
        });
    },

    // Handle dependent selects
    handleDependentSelects: function(config) {
        const selects = config.selects; // Array of select configurations

        // Initialize all selects
        selects.forEach((select, index) => {
            if (select.isAjax) {
                this.initializeSelect2(select.selector, select.options);
            } else {
                this.initializeStaticSelect2(select.selector, select.options);
            }

            // Disable all dependent selects initially except the first one
            if (index > 0) {
                $(select.selector).prop('disabled', true);
            }

            // Handle change event
            $(select.selector).on('change', function(e) {
                const currentValue = $(this).val();

                // If value is cleared
                if (!currentValue) {
                    // Clear and disable all dependent selects
                    for (let i = index + 1; i < selects.length; i++) {
                        $(selects[i].selector).val(null).trigger('change');
                        $(selects[i].selector).prop('disabled', true);
                    }
                    return;
                }

                // Enable next select if exists
                if (index + 1 < selects.length) {
                    const nextSelect = selects[index + 1];
                    $(nextSelect.selector).prop('disabled', false);

                    // If next select has a loadOptions function, call it
                    if (nextSelect.loadOptions) {
                        nextSelect.loadOptions(currentValue).then(options => {
                            // Clear existing options
                            $(nextSelect.selector).empty();

                            // Add new options
                            if (options.length > 0) {
                                // Add empty option if allowClear is true
                                if (nextSelect.options.allowClear) {
                                    $(nextSelect.selector).append(new Option('', '', false, false));
                                }

                                options.forEach(option => {
                                    $(nextSelect.selector).append(new Option(option.text, option.id, false, false));
                                });
                            }

                            $(nextSelect.selector).trigger('change');
                        });
                    }
                }
            });
        });
    }
};

// Select2Manager.initializeSelect2('#id', {
// 		url: url_discussion_no_select2,
// 		fieldName: 'discussifieldNameon_no',
// 		idField: 'idField',
// 		textField: 'textField',
// 		placeholder: ''
// 	});

// How to use select options with dependent selects
// Select2Manager.handleDependentSelects({
//     selects: [
//         {
//             selector: '#select1',
//             isAjax: true,
//             options: {
//                 url: 'url_for_select1',
//                 // ... other options
//             }
//         },
//         {
//             selector: '#select2',
//             isAjax: true,
//             options: {
//                 // ... options
//             },
//             loadOptions: async (select1Value) => {
//                 // Load options based on select1's value
//                 const response = await fetch(`/api/select2-options?parent=${select1Value}`);
//                 const data = await response.json();
//                 return data.map(item => ({
//                     id: item.id,
//                     text: item.name
//                 }));
//             }
//         },
//         {
//             selector: '#select3',
//             isAjax: false,
//             options: {
//                 // ... options for static select2
//             },
//             loadOptions: async (select2Value) => {
//                 // Load options based on select2's value
//                 const response = await fetch(`/api/select3-options?parent=${select2Value}`);
//                 const data = await response.json();
//                 return data.map(item => ({
//                     id: item.id,
//                     text: item.name
//                 }));
//             }
//         },
//         {
//             selector: '#select4',
//             isAjax: false,
//             options: {
//                 // ... options
//             },
//             loadOptions: async (select3Value) => {
//                 // Load options based on select3's value
//                 const response = await fetch(`/api/select4-options?parent=${select3Value}`);
//                 const data = await response.json();
//                 return data.map(item => ({
//                     id: item.id,
//                     text: item.name
//                 }));
//             }
//         }
//     ]
// });
