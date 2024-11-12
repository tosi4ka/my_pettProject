import React from 'react'
import './App.css'
import { GameProvider } from './components/context/GameContext'
import GameScreen from './components/GameScreen/GameScreen'

const App: React.FC = () => {
	return (
		<GameProvider>
			<GameScreen />
		</GameProvider>
	)
}

export default App
