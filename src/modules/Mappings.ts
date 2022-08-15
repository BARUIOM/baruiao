import type { CardData } from "@/components/CollectionCard.vue";

const IsSavedAlbumObject = (object: any): object is SpotifyApi.SavedAlbumObject =>
    'album' in object && object['album'].type === 'album';

const IsPlaylistObjectSimplified = (object: any): object is SpotifyApi.PlaylistObjectSimplified =>
    'tracks' in object && object['type'] === 'playlist';

const IsArtistObjectFull = (object: any): object is SpotifyApi.ArtistObjectFull =>
    'popularity' in object && object['type'] === 'artist';

const SavedAlbumObjectToCardData = ({ album }: SpotifyApi.SavedAlbumObject): CardData => ({
    title: album.name,
    cover: album.images[0].url,
    href: '/album/' + album.id,
    metadata: album.artists.map(
        ({ id, name }) => ({ name, href: '/artist/' + id })
    ),
});

const PlaylistObjectSimplifiedToCardData = (playlist: SpotifyApi.PlaylistObjectSimplified): CardData => {
    const data: CardData = {
        title: playlist.name,
        cover: '',
        href: '/playlist/' + playlist.id,
    };

    if (playlist.images.length)
        data.cover = playlist.images[0].url;

    if (playlist.description)
        data.metadata = [{ name: playlist.description }];

    return data;
};

const ArtistObjectFullToCardData = (artist: SpotifyApi.ArtistObjectFull): CardData => ({
    title: artist.name,
    cover: artist.images[0].url,
    href: '/artist/' + artist.id,
});

export const toCardData = <T>(object: T): CardData => {
    if (IsSavedAlbumObject(object))
        return SavedAlbumObjectToCardData(object);

    if (IsPlaylistObjectSimplified(object))
        return PlaylistObjectSimplifiedToCardData(object);

    if (IsArtistObjectFull(object))
        return ArtistObjectFullToCardData(object);

    throw new Error('Unmappable object');
};
