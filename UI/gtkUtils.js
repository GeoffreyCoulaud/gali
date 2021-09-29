/**
 * Assign an event handler to a GTK widget.
 * Useful when you only need to assign an event on a widget.
 * @param {Gtk.Builder} builder - Builder to use
 * @param {String} id - ID of the widget
 * @param {String} event - Event's name
 * @param {Function} handlers - Handler to assign
 */
function widgetHandleEvent(builder, id, event, handler){
	const widget = builder.getObject(id);
	widget.on(event, handler);
}

module.exports = {
	widgetHandleEvent,
};