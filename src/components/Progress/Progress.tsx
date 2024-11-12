import React from 'react'
import { useGame } from '../context/GameContext'
import style from './Progress.module.css'

export const Progress: React.FC = () => {
	const { score, level } = useGame()
	return (
		<div className={style.progress}>
			<p>Level: {level}</p>
			<p>Balls: {score}</p>
		</div>
	)
}
