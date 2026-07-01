import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { LanguageProvider } from '@/app/context/LanguageContext'

/** Render a component wrapped in the app's context providers (i18n). */
export function renderWithProviders(ui: ReactElement) {
    return render(ui, {
        wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    })
}
