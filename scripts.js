  var pokemonRepository = (function () { //*adds an IIFE to the code
    var $modalContainer = $('#modal-container');
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  //add each pokemon with attributes to pokemonList

  function add(pokemon) {
    pokemonList.push(pokemon);
  };

  //pull all pokemon data
  function getAll() {
    return pokemonList;
  };

  //add new listItem for each pokemon object
  function addListItem(pokemon) {
    var $pokemonList = document.querySelector('ul');
    //create a new li-item with button for each pokemon
    var $listItem = $('li');
    var $button = $('button');
    //append listItem to unordered list as its child
    $pokemonList.appendChild($listItem);
    //append the button to list item as its child
    $listItem.appendChild($button);
    //button shows the name of the current pokemon
    $button.innerText = pokemon.name;
    $button.classList.add('pokemon-name'); // instead of pokemon-name list-button?
    //give button a custom style from styles.css to overwrite default styling
    $listItem.classList.add('button');
    //give the button a function when it is clicked
    $button.addEventListener('click', function(event) {
    //calls function showDetails to show attributes from each pokemon
      showDetails(pokemon);
    });
  }

  //Function to load pokemon list from apiURL
  function loadList() {
    return $.ajax(apiUrl).then(function (response) {
      //JSON: format used when exchanging data with external sources
      return response.json();
      // if promise is resolved then function(passed parameter) {...}
    }).then(function (json) {
      json.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url,
          height: item.height,
        };
        add(pokemon);
      });
      //if promise is rejected, then catch (function(passed parameter) {...}
    }).catch (function (error) {
      console.error(error);
    });
    }

    //function to load details from each pokemon
    function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url).then(function (response) {
        return response.json()
      }).then(function (details) {
        //adds details to each item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types; //add object.keys(details.types)?
      }).catch(function (error) {
        console.error(error);
      });
    }

    //function to return pokedex array
    function catchAll(){
      return pokemonList;
    }

    //function to show details of each pokemon in alert window
    function showDetails(item) {
      loadDetails(item).then(function (){
        console.log(item);
        showModal(item);
        //*alert('Height: '  + item.height + ' ' + ' Type: ' + item.types);
      });
    }

    //adds a modal to display information with close button, title and text
    function showModal(item) {
      var modalContainer = document.querySelector('#modal-container')
        // Clear all existing modal content
        modalContainer.innerHTML = '';

        var modal = document.createElement('div');
        modal.classList.add('modal');

        // Add the new modal content
        var closeButtonElement = $('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'Close';
        closeButtonElement.addEventListener('click', hideModal);

        var titleElement = $('h1');
        titleElement.innerText = item.name;

        var contentElement = $('p');
        contentElement.innerText = 'Height: ' + item.height;

        var imgElement = $("img"); 
        imgElement.classList.add('modal-img');
        imgElement.setAttribute("src", item.imageUrl);

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement); 
        modal.appendChild(imgElement);
        modal.appendChild(contentElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
      }

      $('#show-modal').on('click', () => {showModal('Modal title', 'This is the modal content!');
      });

      function hideModal() {
        var modalContainer = $('#modal-container');
        modalContainer.classList.remove('is-visible');
    
        if (dialogPromiseReject) {
        dialogPromiseReject();
        dialogPromiseReject = null;
      };
    }
    //adds a dialog for interaction within the modal
      function showDialog(title, text) {
        showModal(title, text);
        //add a confirm and cancel button to the modal
        var modal = $('.modal');
        var confirmButton = $('button');
        confirmButton.classList.add('modal-confirm');
        confirmButton.InnerText = 'Confirm';
    
        var cancelButton = $('button');
        cancelButton.classList.add('modal-cancel');
        cancelButton.InnerText = 'Cancel';
        //the dialog always rejects if the modal is closed
        var dialogPromiseReject;
    
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);
    
        //we focus on the confirm button, so the user can simply press enter
        confirm.button(focus);
    
        //returns a promise that resolves when confirmed otherwise rejects
        return new Promise((resolve, reject) => {
          cancelButton.on('click', hideModal);
          confirmButton.on('click', () => {
            dialogPromiseReject = null;
            hideModal();
            resolve();
          });
          dialogPromiseReject = reject;
        });
      }
    
    
      $('#show-modal').on('click', () => {
        howModal('Modal title', 'This is the modal content!');
      });
    
      //checks whether user has confirmed action
      $('#show-dialog').on('click', () => {
        showDialog('Confirm action', 'Are you sure you want to do this?').then(function() {
          alert('confirmed!');
        }, () => {
          alert('not confirmed');
        });
      });
    
      window.addEventListener('keydown', (e) => {
        var modalContainer = $('#modal-container')
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
          hideModal();
        }
      });
    
      modalContainer.on('click', (e) => {
        // Since this is also triggered when clicking INSIDE the modal container,
        // We only want to close if the user clicks directly on the overlay
        var target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      });
    
    
    //returns the values which can be used outside of the IIFE
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
    };
    

    var dialogPromiseReject;

    //creates a list of buttons with pokemon names
    pokemonRepository.loadList().then(function() {
      pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
      });
    })
 }); //*End of IIFE