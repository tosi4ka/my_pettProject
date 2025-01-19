import React from 'react'
import { StartScreenProps } from '../../types'
import style from './StartScreen.module.css'

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
	return (
		<div className={style.startScreen}>
			<h1>Game "Memorizing Words"</h1>
			<button onClick={onStart}>Start</button>
		</div>
	)
}
