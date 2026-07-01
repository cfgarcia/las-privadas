// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import Hero from './Hero'

describe('Hero', () => {
    it('renders the Spanish hero copy from the i18n dictionary (default locale)', () => {
        renderWithProviders(<Hero />)

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Reserva tu artista')
        expect(screen.getByText('Titan Records')).toBeInTheDocument()
        expect(screen.getByText(/Llevamos el corrido a tu privada/)).toBeInTheDocument()
    })
})
