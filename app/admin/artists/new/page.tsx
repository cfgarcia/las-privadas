import ArtistForm from "../ArtistForm"
import { createArtist } from "../../actions"

export default function NewArtistPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Artist</h2>
            <ArtistForm action={createArtist} />
        </div>
    )
}
