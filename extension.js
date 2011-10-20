const AppDisplay = imports.ui.appDisplay;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;

/**
 * TODO: 
 * - only works on clicks. if the app is selected by keyboard it wont
 * - black/whitelists?
 * - special key (Shift?) to go for instance on another workspace? 
 */
function init() {
}

function enable() {
	// rename the init function
	AppDisplay.AppWellIcon.prototype._org_init = AppDisplay.AppWellIcon.prototype._init;
	
	// and override it with the modified onActivateOverride parameter
	AppDisplay.AppWellIcon.prototype._init = function(app, iconParams, onActivateOverride) {
		// TODO: what to do if there is actually an onActivateOverride function set?
		onActivateOverride = function(event) {		
			
			// start a new instance/window on the current workspace if the CTRL Key is pressed
			// or there is no instance on the current workspace
			let modifiers = Shell.get_event_state(event);
			if (this.app.state == Shell.AppState.RUNNING
				&& ( (modifiers & Clutter.ModifierType.CONTROL_MASK)
				  || !this.app.is_on_workspace(global.screen.get_active_workspace()) ) 
			   ) {
				this.app.open_new_window(-1);
			} else {
				this.app.activate();
			}
		}
	
		// call the original init function
		this._org_init(app, iconParams, onActivateOverride);
	}; 
}

function disable() {
	AppDisplay.AppWellIcon.prototype._init = AppDisplay.AppWellIcon.prototype._org_init;
}
