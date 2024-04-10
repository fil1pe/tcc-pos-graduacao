import { useContext as reactUseContext } from 'react'
import { context } from '~/pages/_app'

export const useContext = () => reactUseContext(context)
