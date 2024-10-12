(function() {
	// code here

  // This anonymous function syntax is executed immediately once the script tag is loaded
})();

window.addEventListener('load', function() {
  applySavedTranslation(); // Apply saved translation on page load
  // setTimeout(removeGoogleTranslateElements, 10000); // Adjust timeout if necessary
});

function applySavedTranslation() {
  var savedLanguage = sessionStorage.getItem('selectedLanguage');
  if (savedLanguage) {
      var googleTranslateElement = document.getElementsByClassName("goog-te-combo")[0];
      if (googleTranslateElement) {
          googleTranslateElement.value = savedLanguage;
          googleTranslateElement.dispatchEvent(new Event('change'));
      }
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

function removeGoogleTranslateElements() {
  // Target all possible Google Translate elements
  var frame = document.querySelector('.goog-te-banner-frame');
  if (frame) {
      frame.style.display = 'none';
      frame.style.height = '0px';
  }

  var elements = document.querySelectorAll('iframe, .skiptranslate, .goog-te-balloon-frame, .goog-te-menu-frame, .goog-te-menu2');
  elements.forEach(function(element) {
      element.style.display = 'none';
  });

  document.body.style.marginTop = '0px';
  document.body.style.paddingTop = '0px';
  document.documentElement.style.marginTop = '0px';
  document.documentElement.style.paddingTop = '0px';
}

(function() {
  "use strict"; // Start of use strict

  var sidebar = document.querySelector('.sidebar');
  var sidebarToggles = document.querySelectorAll('#sidebarToggle, #sidebarToggleTop');
  
  if (sidebar) {
    
    var collapseEl = sidebar.querySelector('.collapse');
    var collapseElementList = [].slice.call(document.querySelectorAll('.sidebar .collapse'))
    var sidebarCollapseList = collapseElementList.map(function (collapseEl) {
      return new bootstrap.Collapse(collapseEl, { toggle: false });
    });

    for (var toggle of sidebarToggles) {

      // Toggle the side navigation
      toggle.addEventListener('click', function(e) {
        document.body.classList.toggle('sidebar-toggled');
        sidebar.classList.toggle('toggled');

        if (sidebar.classList.contains('toggled')) {
          for (var bsCollapse of sidebarCollapseList) {
            bsCollapse.hide();
          }
        };
      });
    }

    // Close any open menu accordions when window is resized below 768px
    window.addEventListener('resize', function() {
      var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

      if (vw < 768) {
        for (var bsCollapse of sidebarCollapseList) {
          bsCollapse.hide();
        }
      };
    });
  }

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  
  var fixedNaigation = document.querySelector('body.fixed-nav .sidebar');
  
  if (fixedNaigation) {
    fixedNaigation.on('mousewheel DOMMouseScroll wheel', function(e) {
      var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

      if (vw > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    });
  }

  var scrollToTop = document.querySelector('.scroll-to-top');
  
  if (scrollToTop) {
    
    // Scroll to top button appear
    window.addEventListener('scroll', function() {
      var scrollDistance = window.pageYOffset;

      //check if user is scrolling up
      if (scrollDistance > 100) {
        scrollToTop.style.display = 'block';
      } else {
        scrollToTop.style.display = 'none';
      }
    });
  }

})(); // End of use strict
