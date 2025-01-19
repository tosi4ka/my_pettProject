import React from 'react'
import { GameOverScreenProps } from '../../types'
import style from './GameOverScreen.module.css'

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
	score,
	onRestart,
}) => {
	return (
		<div className={style.gameOverContent}>
			<p>C'est fini</p>
			<p>Votre score est de: {score}</p>
			<button className={style.restartButton} onClick={onRestart}>
				Voulez-vous répéter ?
			</button>
		</div>
	)
}
