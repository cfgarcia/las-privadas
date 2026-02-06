"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Artist {
    id: string
    name: string
    imageUrl: string | null
    order: number
    description: string
    _count?: { bookings: number }
}

interface SortableArtistListProps {
    initialArtists: Artist[]
    onSaveOrder: (newOrder: { id: string, order: number }[]) => Promise<void>
}

// --- Sortable Item Component ---
function SortableItem(props: { artist: Artist }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.artist.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group relative"
        >
            <div className="h-48 w-full bg-gray-200 relative">
                {props.artist.imageUrl ? (
                    <img src={props.artist.imageUrl} alt={props.artist.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                {/* Drag Handle Overlay */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/10 cursor-move flex items-center justify-center transition-colors"
                >
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded shadow text-xs font-bold uppercase tracking-wider">Drag to Move</span>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col pointer-events-none">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{props.artist.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{props.artist.description}</p>

                <div className="mt-auto flex items-center justify-between text-sm pointer-events-auto">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {props.artist._count?.bookings || 0} Bookings
                    </span>
                    <div className="flex gap-2 relative z-20">
                        <a href={`/artist/${props.artist.id}`} target="_blank" className="text-gray-500 hover:text-gray-700">View</a>
                        <a href={`/admin/artists/${props.artist.id}`} className="text-blue-500 hover:text-blue-700 font-medium">Edit</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Main List Component ---
export default function SortableArtistList({ initialArtists, onSaveOrder }: SortableArtistListProps) {
    const [artists, setArtists] = useState(initialArtists)
    const [hasChanged, setHasChanged] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setArtists((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                return newItems
            })
            setHasChanged(true)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Create updating payload: index becomes rank
            const orderPayload = artists.map((artist, index) => ({
                id: artist.id,
                order: index
            }))

            await onSaveOrder(orderPayload)
            setHasChanged(false)
            alert("Order saved successfully!")
        } catch (error) {
            console.error(error)
            alert("Failed to save order.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div>
            {hasChanged && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center animate-fade-in">
                    <span className="text-yellow-800 font-medium">You have unsaved changes to the artist order.</span>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow-sm text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Order"}
                    </button>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={artists.map(a => a.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artists.map((artist) => (
                            <SortableItem key={artist.id} artist={artist} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}
