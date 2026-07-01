// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
    it('calls onQuery as the user types', async () => {
        const onQuery = vi.fn()
        render(<SearchBar query="" onQuery={onQuery} appear={1} resultCount={0} />)

        await userEvent.type(screen.getByPlaceholderText('Busca un artista…'), 'a')

        expect(onQuery).toHaveBeenCalledWith('a')
    })

    it('clears the query when the clear button is pressed', async () => {
        const onQuery = vi.fn()
        render(<SearchBar query="el" onQuery={onQuery} appear={1} resultCount={3} />)

        await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }))

        expect(onQuery).toHaveBeenCalledWith('')
    })
})
