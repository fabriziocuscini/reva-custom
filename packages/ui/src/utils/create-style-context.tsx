import { createContext, useContext, type ComponentProps, type ElementType } from 'react'

export function createStyleContext<T extends Record<string, string>>(
  recipe: ((props?: any) => T) & { splitVariantProps: (props: any) => [any, any] },
) {
  const StyleContext = createContext<T | null>(null)

  function withProvider<C extends ElementType>(Component: C, slot: keyof T) {
    return function StyledComponent(props: ComponentProps<C> & Parameters<typeof recipe>[0]) {
      const [recipeProps, componentProps] = recipe.splitVariantProps(props)
      const classes = recipe(recipeProps)
      return (
        <StyleContext.Provider value={classes}>
          <Component {...(componentProps as any)} className={classes[slot as string]} />
        </StyleContext.Provider>
      )
    }
  }

  function withContext<C extends ElementType>(Component: C, slot: keyof T) {
    return function StyledComponent(props: ComponentProps<C>) {
      const classes = useContext(StyleContext)
      return <Component {...(props as any)} className={classes?.[slot as string]} />
    }
  }

  return { withProvider, withContext }
}
