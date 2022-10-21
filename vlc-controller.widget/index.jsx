import { run }         from 'uebersicht';
import * as Libraries  from './lib/libraries.bundle';
import * as Components from './lib/components';

const server   = 'http://localhost:9090';
const user     = '';
const password = '';

export const className = `
	font-size:     0.8em;
	top:           0.5em;
	left:          0.5em;
	width:         25em;
	height:        10em;
	padding:       0.5em;
	border-radius: 0.5em;
	color:         rgba(230,230,230,.8);
	background:    rgba(51,49,50,.9);
`;

const auth     = (() => {
	if (!user && !password) {
		return '';
	}

	const option = [];

	if ('string' === typeof(user)) {
		option.push(user);
	}

	if ('string' === typeof(password)) {
		option.push(0 < option.length ? `:${password}` : password);
	}

	return ` -u '${option.join('')}'`
})();

const COMMANDS = {
	GET_PLAYLIST: `curl -sS -L '${server}/requests/playlist.xml'${auth}`,
	GET_STATUS:   `curl -sS -L '${server}/requests/status.xml'${auth}`,
	PLAY:         `curl -sS -L '${server}/requests/status.xml?command=pl_play&id=<id>'${auth}`,
	STOP:         `curl -sS -L '${server}/requests/status.xml?command=pl_stop'${auth}`,
	VOLUME:       `curl -sS -L '${server}/requests/status.xml?command=volume&val=<value>'${auth}`,
};

const STATUS   = {
	STARTUP: 'VC/STARTUP',
	INIT:    'VC/INIT',
	SELECT:  'VC/SELECT',
	PLAY:    'VC/PLAY',
	STOP:    'VC/STOP',
	VOLUME:  'VC/VOLUME',
};

const STATES   = {
	PLAYING: 'playing',
	STOPPED: 'stopped',
};

const VOLUME   = {
	MAX: 300,
	MIN: 0,
}

export const command          = undefined;

export const refreshFrequency = false;

export const initialState     = { type: STATUS.STARTUP };

export const init             = (dispatch) => {
	run(
		COMMANDS.GET_PLAYLIST
	).then(
		(output) => {
			const [playlist, media, playing] = Libraries.vlc.playlist(output);

			run(
				COMMANDS.GET_STATUS
			).then(
				(output) => {
					const status            = Libraries.vlc.status(output);					
					const [select, library] = cycling(playing, [...playlist, ...media]);

					dispatch({
						type:    STATUS.INIT,
						playing: playing,
						library: library,
						select:  select,
						...status,
					});
				}
			).catch(
				(error) => {
					dispatch({ type: STATUS.INIT, error: error });
				}
			);
		}
	).catch(
		(error) => {
			dispatch({ type: STATUS.INIT, error: error });
	});
};

export const updateState      = (event, previousState) => {
	if (event.error) {
		return { ...previousState, type: event.type, warning: `We got an error: ${event.error}` };
	}

	return { ...previousState, ...event};
}

export const render           = (props, dispatch) => {
	return (
		STATUS.STARTUP === props.type || props.warning ? (
			<Components.Atoms.Display
				style = {{
					'& div.screen': {
						position:  'absolute',
						top:       '0',
						bottom:    '0',
						left:      '0',
						right:     '0',

						color:     (props.warning ? 'red'  : 'inherit' ),
						textAlign: (props.warning ? 'left' : 'center' ),
					}
				}}
			>
				{ props.warning ? props.warning : '起動中です...' }
			</Components.Atoms.Display>
		) : (
			<div>
				<link
					rel  = 'stylesheet'
					href = '/vlc-controller.widget/lib/icono.min.css'
				/>
				<Components.Atoms.Display
					description = '再生中'
					style       = {{ '& div.screen': { color: 'rgba(0,255,127,.7)' } }}
				>
					{ showName(props) }
				</Components.Atoms.Display>
				<Components.Molecuels.Library
					style        = {{ margin: '0.5em 0' }}
					onClickLeft  = {() => {
						const [select, library] = cycling([...props.library].pop().name, props.library)

						dispatch({
							type:    STATUS.SELECT,
							select:  select,
							library: library,
						});
					}}
					onClickRight = {() => {
						const [select, library] = cycling(props.library[1].name, props.library);

						dispatch({
							type:    STATUS.SELECT,
							select:  select,
							library: library,
						});
					}}
				>
					{ props.select.name }
				</Components.Molecuels.Library>
				<Components.Molecuels.Controller
					onClickPlay       = {() => {
						run(
							COMMANDS.PLAY.replace('<id>', props.select.id)
						).then(
							(output) => {
								const status            = Libraries.vlc.status(output);
								const [select, library] = cycling(props.select.name, props.library);
			
								dispatch({
									type:    STATUS.PLAY,
									playing: props.select.name,
									library: library,
									select:  select,
									...status,
								});
							}
						).catch(
							(error) => {
								dispatch({ type: STATUS.PLAY, error: error });
							}
						);
					}}
					onClickStop       = {() => {
						run(
							COMMANDS.STOP
						).then(
							(output) => {
								const status = Libraries.vlc.status(output);

								dispatch({
									type:    STATUS.STOP,
									...status,
								});
							}
						).catch(
							(error) => {
								dispatch({ type: STATUS.STOP, error: error });
							}
						);
					}}
					onClickVolumeUp   = {() => {
						if (VOLUME.MAX <= props.volume + 10) { volume(dispatch, VOLUME.MAX.toString()); } volume(dispatch, '+10');
					}}
					onClickVolumeDown = {() => {
						if (VOLUME.MIN >= props.volume - 10) { volume(dispatch, VOLUME.MIN.toString()); } volume(dispatch, '-10');
					}}
					volume            = { props.volume }
				/>
			</div>
		)
    );
}

function showName(props) {
	return STATES.PLAYING === props.state && props.playing ? props.playing : '';
}

function cycling(target, library) {
	const list   = [...library];
	let   select = undefined;

	library.some(
		(item) => {
			if (target === item.name) {
				select = item;
				return true;
			} else {
				list.push(list.shift());
			}
		}
	);

	return [select, list];
}

function volume(dispatch, value) {
	run(
		COMMANDS.VOLUME.replace('<value>', value)
	).then(
		(output) => {
			const status = Libraries.vlc.status(output);

			dispatch({
				type:    STATUS.VOLUME,
				...status,
			});
		}
	).catch(
		(error) => {
			dispatch({ type: STATUS.VOLUME, error: error });
		}
	);
}
