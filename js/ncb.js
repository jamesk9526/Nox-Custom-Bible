jQuery(document).ready(function($) {
    // URLs of the JSON file
    var bibleDataUrl = ncb_params.NCB_PLUGIN_URL + 'bible-data/Bible.json';

    // Including all abbreviations as provided
    var abbreviations = {
        "GEN": {"full_name": "Genesis", "abbreviations": ["Ge"]},
        "EXO": {"full_name": "Exodus", "abbreviations": ["Ex"]},
        "LEV": {"full_name": "Leviticus", "abbreviations": ["Le"]},
        "NUM": {"full_name": "Numbers", "abbreviations": ["Nu"]},
        "DEU": {"full_name": "Deuteronomy", "abbreviations": ["De"]},
        "JOS": {"full_name": "Joshua", "abbreviations": ["Jos"]},
        "JUD": {"full_name": "Jude", "abbreviations": ["Jude"]},
        "RUT": {"full_name": "Ruth", "abbreviations": ["Ru"]},
        "1 S": {"full_name": "1 Samuel", "abbreviations": ["1Sa"]},
        "2 S": {"full_name": "2 Samuel", "abbreviations": ["2Sa"]},
        "1 K": {"full_name": "1 Kings", "abbreviations": ["1Ki"]},
        "2 K": {"full_name": "2 Kings", "abbreviations": ["2Ki"]},
        "1 C": {"full_name": "1 Corinthians", "abbreviations": ["1Co"]},
        "2 C": {"full_name": "2 Corinthians", "abbreviations": ["2Co"]},
        "EZR": {"full_name": "Ezra", "abbreviations": ["Ezr"]},
        "NEH": {"full_name": "Nehemiah", "abbreviations": ["Ne"]},
        "EST": {"full_name": "Esther", "abbreviations": ["Es"]},
        "JOB": {"full_name": "Job", "abbreviations": ["Job"]},
        "PSA": {"full_name": "Psalms", "abbreviations": ["Ps"]},
        "PRO": {"full_name": "Proverbs", "abbreviations": ["Pr"]},
        "ECC": {"full_name": "Ecclesiastes", "abbreviations": ["Ec"]},
        "SON": {"full_name": "Song of Solomon", "abbreviations": ["Song"]},
        "ISA": {"full_name": "Isaiah", "abbreviations": ["Isa"]},
        "JER": {"full_name": "Jeremiah", "abbreviations": ["Jer"]},
        "LAM": {"full_name": "Lamentations", "abbreviations": ["La"]},
        "EZE": {"full_name": "Ezekiel", "abbreviations": ["Eze"]},
        "DAN": {"full_name": "Daniel", "abbreviations": ["Da"]},
        "HOS": {"full_name": "Hosea", "abbreviations": ["Ho"]},
        "JOE": {"full_name": "Joel", "abbreviations": ["Joe"]},
        "AMO": {"full_name": "Amos", "abbreviations": ["Am"]},
        "OBA": {"full_name": "Obadiah", "abbreviations": ["Ob"]},
        "JON": {"full_name": "Jonah", "abbreviations": ["Jon"]},
        "MIC": {"full_name": "Micah", "abbreviations": ["Mic"]},
        "NAH": {"full_name": "Nahum", "abbreviations": ["Na"]},
        "HAB": {"full_name": "Habakkuk", "abbreviations": ["Hab"]},
        "ZEP": {"full_name": "Zephaniah", "abbreviations": ["Zep"]},
        "HAG": {"full_name": "Haggai", "abbreviations": ["Hag"]},
        "ZEC": {"full_name": "Zechariah", "abbreviations": ["Zec"]},
        "MAL": {"full_name": "Malachi", "abbreviations": ["Mal"]},
        "MAT": {"full_name": "Matthew", "abbreviations": ["Mt"]},
        "MAR": {"full_name": "Mark", "abbreviations": ["Mr"]},
        "LUK": {"full_name": "Luke", "abbreviations": ["Lu"]},
        "JOH": {"full_name": "John", "abbreviations": ["Joh"]},
        "ACT": {"full_name": "Acts", "abbreviations": ["Ac"]},
        "ROM": {"full_name": "Romans", "abbreviations": ["Ro"]},
        "GAL": {"full_name": "Galatians", "abbreviations": ["Ga"]},
        "EPH": {"full_name": "Ephesians", "abbreviations": ["Eph"]},
        "PHI": {"full_name": "Philemon", "abbreviations": ["Phm"]},
        "COL": {"full_name": "Colossians", "abbreviations": ["Col"]},
        "1 T": {"full_name": "1 Timothy", "abbreviations": ["1Ti"]},
        "2 T": {"full_name": "2 Timothy", "abbreviations": ["2Ti"]},
        "TIT": {"full_name": "Titus", "abbreviations": ["Tit"]},
        "HEB": {"full_name": "Hebrews", "abbreviations": ["Heb"]},
        "JAM": {"full_name": "James", "abbreviations": ["Jas"]},
        "1 P": {"full_name": "1 Peter", "abbreviations": ["1Pe"]},
        "2 P": {"full_name": "2 Peter", "abbreviations": ["2Pe"]},
        "1 J": {"full_name": "1 John", "abbreviations": ["1Jo"]},
        "2 J": {"full_name": "2 John", "abbreviations": ["2Jo"]},
        "3 J": {"full_name": "3 John", "abbreviations": ["3Jo"]},
        "REV": {"full_name": "Revelation", "abbreviations": ["Re"]}
    };

    // Fetch the Bible data
    $.getJSON(bibleDataUrl, function(bibleData) {
        // Function to normalize a reference (e.g., "1Co" to "1 Corinthians")
        function normalizeReference(reference) {
            var abbreviationsObj = {};
            for (var key in abbreviations) {
                abbreviations[key].abbreviations.forEach(function(abb) {
                    abbreviationsObj[abb.toUpperCase()] = abbreviations[key].full_name;
                });
            }

            for (var abbreviation in abbreviationsObj) {
                if (abbreviationsObj.hasOwnProperty(abbreviation)) {
                    var re = new RegExp("\\b" + abbreviation + "\\b", 'g');
                    reference = reference.replace(re, abbreviationsObj[abbreviation]);
                }
            }

            return reference;
        }
		

        // Function to highlight references in a text node
        function highlightTextNode(textNode) {
            var regex = /\b(?:\d\s?)?[A-Za-z]+\s\d+[:]\d+(?:[-]\d+)?\b/g;
            var text = textNode.nodeValue;
            var highlightedText = text.replace(regex, function(match) {
                match = normalizeReference(match);
                return '<span class="highlighted-reference" style="background-color: yellow;" data-reference="' + match + '">' + match + '</span>';
            });

            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = highlightedText;
            var replacementNodes = Array.from(tempDiv.childNodes);
            $(textNode).replaceWith(replacementNodes);
        }

        // Iterate through all text nodes in the body and highlight references
        $('body').find('*').contents().each(function() {
            if (this.nodeType === 3) {  // Text node
                highlightTextNode(this);
            }
        });

        // Handle click events on highlighted references
          $('body').on('click', '.highlighted-reference', function() {
    var reference = $(this).data('reference');
    var bookName = reference.split(' ')[0];
    var chapterVerse = reference.split(' ')[1];
    
	// Add a check here to ensure chapter and verse are defined
    if (!chapterVerse || chapterVerse.split(':').length < 2) {
        console.error('Invalid reference format:', chapterVerse);
        return;
    }
	
	var chapter = parseInt(chapterVerse.split(':')[0], 10);
    var verses = chapterVerse.split(':')[1].split('-').map(Number); // Handling verse ranges

    var verseText = "Verses not found";  // Default text if the verses are not found

    if (verses.length === 1) {
        // Single verse
        for (var i = 0; i < bibleData.length; i++) {
            if (bibleData[i].BookName === bookName &&
                parseInt(bibleData[i].Chapter, 10) === chapter &&
                parseInt(bibleData[i].Verse, 10) === verses[0]) {
                verseText = bibleData[i].VText;
                break;
            }
        }
    } else if (verses.length > 1) {
        // Verse range
        verseText = '';
        for (var i = 0; i < bibleData.length; i++) {
            if (bibleData[i].BookName === bookName &&
                parseInt(bibleData[i].Chapter, 10) === chapter &&
                parseInt(bibleData[i].Verse, 10) >= verses[0] &&
                parseInt(bibleData[i].Verse, 10) <= verses[1]) {
                verseText += bibleData[i].VText + ' ';
            }
        }
    }

            var modalHtml = '<div id="verseModal" class="modal">' +
                                '<div class="modal-content">' +
                                    '<span class="close">&times;</span>' +
                                    '<div class="verse-text">' + verseText + '</div>' +  // Updated to show verseText
                                    '<div class="plugin-info">' +
                                        '<p>NoxCustomBible</p>' +
                                        '<p>Pure Cambridge Edition King James Version</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
            $('body').append(modalHtml);
            var modal = $('#verseModal');
            modal.show();

            modal.find('.close').on('click', function() {
                modal.remove();
            });
        });
    });
});
