import { Circle as BaseCircle, type CircleProps as BaseCircleProps } from 'styled-system/jsx'

export interface CircleProps extends BaseCircleProps {}

export const Circle = BaseCircle
Circle.displayName = 'Circle'
