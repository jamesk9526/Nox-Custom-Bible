jQuery(document).ready(function($) {

    var abbreviations = {
        "GEN": { "full_name": "Genesis", "abbreviations": ["Gen", "Ge", "Gn"] },
        // ... (all other book abbreviations here)
        "REV": { "full_name": "Revelation", "abbreviations": ["Rev", "Re", "Rv"] }
    };

    function normalizeReference(reference) {
        return new Promise((resolve, reject) => {
            reference = reference.trim().toLowerCase().replace(/\b\w/g, function(l) {
                return l.toUpperCase();
            });

            var abbreviationsObj = {};
            for (var key in abbreviations) {
                abbreviations[key].abbreviations.forEach(function(abb) {
                    abbreviationsObj[abb.toUpperCase()] = abbreviations[key].full_name;
                });
            }

            for (var abbreviation in abbreviationsObj) {
                if (abbreviationsObj.hasOwnProperty(abbreviation)) {
                    reference = reference.replace(new RegExp(abbreviation, 'g'), abbreviationsObj[abbreviation]);
                }
            }

            reference = reference.replace(/[\s,.;]+/g, ':');
            resolve(reference);
        });
    }

    function highlightTextNode(textNode) {
        var regex = /\b(?:\d\s?)?[A-Za-z]+\s\d+[:]\d+(?:[-]\d+)?\b/g;
        var text = textNode.nodeValue;
        var highlightedText = text.replace(regex, function(match) {
            return '<span class="bible-reference">' + match + '</span>';
        });
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedText;
        var replacementNodes = Array.from(tempDiv.childNodes);
        $(textNode).replaceWith(replacementNodes);
        return replacementNodes;
    }

    function highlightBibleReferences(element) {
        element.contents().each(function() {
            if (this.nodeType === 3) {  // Text node
                highlightTextNode(this);
            } else if (this.nodeType === 1) {  // Element node
                highlightBibleReferences($(this));  // Recurse into child elements
            }
        });
    }

    function attachPopupToReferences() {
        $('body').on('mouseover', '.bible-reference', function() {
            var reference = $(this).text();
            fetchVerse(reference, $(this));
        });
    }

    function fetchVerse(reference, element) {
        normalizeReference(reference).then(function(normalizedReference) {
            $.ajax({
                url: '/wp-content/plugins/nox-custom-bible/fetch-verse.php',
                data: { reference: normalizedReference },
                success: function(verse) {
                    if (verse && verse.trim() !== "") {
                        showPopup(verse, element);
                    } else {
                        console.error('Verse not found for the reference:', normalizedReference);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Failed to fetch the verse. Error:', errorThrown);
                    alert('Error: ' + errorThrown);
                }
            });
        }).catch(function(error) {
            console.error('Failed to normalize the reference. Error:', error);
        });
    }

    function showPopup(verse, element) {
        var popup = $('<div class="bible-popup">' + verse + '<div class="your-info">Pure Cambridge Edition - NCB</div></div>');
        $('body').append(popup);
        popup.css({
            top: element.offset().top + element.height(),
            left: element.offset().left
        });

        element.on('mouseleave', function() {
            popup.remove();
        });

        popup.on('mouseleave', function() {
            popup.remove();
        });
    }

    highlightBibleReferences($('body'));
    attachPopupToReferences();
});
