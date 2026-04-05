import { Circle as PandaCircle, type CircleProps as PandaCircleProps } from 'styled-system/jsx'

export interface CircleProps extends PandaCircleProps {}

export const Circle = PandaCircle
Circle.displayName = 'Circle'
