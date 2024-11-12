import React from 'react'
import { useGame } from '../context/GameContext'

const GameInfo: React.FC = () => {
	const { score, level } = useGame()

	return (
		<div className='game-info'>
			<p>Level: {level}</p>
			<p>Balls: {score}</p>
			<p>Select answer</p>
		</div>
	)
}

export default GameInfo
