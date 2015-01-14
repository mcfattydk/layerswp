/**
* Content Widget JS file
*
* This file contains functions relating to the Content Widget
 *
 * @package Layers
 * @since Layers 1.0
 * Contents
 * 1 - Sortable items
 * 2 - Column Removal & Additions
 * 3 - Column Title Update
*/

jQuery(document).ready(function($){

	/**
	* 1 - Sortable items
	*/
	layers_set_column_sorable();

	$(document).on ( 'widget-added' , function(){
		layers_set_column_sorable();
	});

	function layers_set_column_sorable(){

		var $column_lists = $( 'ul[id^="column_list_"]' );

		$column_lists.sortable({
			placeholder: "layers-sortable-drop",
			handle: ".layers-accordion-title",
			stop: function(e , li){
				// Module UL, looking up from our current target
				$columnList = li.item.closest( 'ul' );

				// Modules <input>
				$columnInput = $( '#column_ids_input_' + $columnList.data( 'number' ) );

				// Apply new column order
				$column_guids = [];
				$columnList.find( 'li.layers-accordion-item' ).each(function(){
					$column_guids.push( $(this).data( 'guid' ) );
				});

				// Trigger change for ajax save
				$columnInput.val( $column_guids.join() ).layers_trigger_change();
			}
		});
	}

	/**
	* 2 - Column Removal & Additions
	*/

	$(document).on( 'click' , 'ul[id^="column_list_"] .icon-trash' , function(e){
		e.preventDefault();

		// "Hi Mom"
		var $that = $(this);

		// Confirmation message @TODO: Make JS confirmation column
		var $remove_column = confirm( "Are you sure you want to remove this column?" );

		if( false === $remove_column ) return;

		// Module UL
		$columnList = $( '#column_list_' + $that.data( 'number' ) );

		// Modules <input>
		$columnInput = $( '#column_ids_input_' + $columnList.data( 'number' ) );

		// Remove this banner
		$that.closest( '.layers-accordion-item' ).remove();

		// Curate column IDs
		$column_guids = [];

		$columnList.find( 'li.layers-accordion-item' ).each(function(){
			$column_guids.push( $(this).data( 'guid' ) );
		});

		// Trigger change for ajax save
		$columnInput.val( $column_guids.join() ).layers_trigger_change();

		// Reset Sortable Items
		layers_set_column_sorable();
	});

	$(document).on( 'click' , '.layers-add-widget-column' , function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Create the list selector
		$columnListId = '#column_list_' + $that.data( 'number' );

		// Module UL
		$columnList = $( $columnListId );

		// Modules <input>
		$columnInput = $( '#column_ids_input_' + $columnList.data( 'number' ) );

		// Serialize input data
		$serialized_inputs = [];
		$.each(
			$columnList.find( 'li.layers-accordion-item' ).last().find( 'textarea, input, select' ),
			function( i, input ){
				$serialized_inputs.push( $(input).serialize() );
		});

		$.post(
			layers_widget_params.ajaxurl,
			{
				action: 'layers_content_widget_actions',
				widget_action: 'add',
				id_base: $columnList.data( 'id_base' ),
				instance: $serialized_inputs.join( '&' ),
				last_guid: $columnList.find( 'li.layers-accordion-item' ).last().data( 'guid' ),
				number: $columnList.data( 'number' ),
				nonce: layers_widget_params.nonce

			},
			function(data){
console.log( data );
				// Append column HTML
				$( data ).insertBefore( $columnListId + ' .layers-add-widget-column' );

				// Append column IDs to the columns input
				$column_guids = [];
				$columnList.find( 'li.layers-accordion-item' ).each(function(){
					$column_guids.push( $(this).data( 'guid' ) );
				});

				// Trigger change for ajax save
				$columnInput.val( $column_guids.join() ).layers_trigger_change();

				// Trigger color selectors
				jQuery('.layers-color-selector').wpColorPicker();
			}
		) // $.post

	});

	/**
	* 3 - Module Title Update
	*/

	$(document).on( 'keyup' , 'ul[id^="column_list_"] input[id*="-title"]' , function(e){

		// "Hi Mom"
		$that = $(this);

		// Set the Title
		$string = ': ' + $that.val();

		// Update the accordian title
		$that.closest( '.layers-accordion-item' ).find( 'span.layers-detail' ).text( $string );

	});


}); //jQuery