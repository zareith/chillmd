import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { get, set } from 'idb-keyval';
import { workspaceRootKey } from './utils/idb-keys';

// @ts-expect-error - Replaced by workbox
precacheAndRoute(self.__WB_MANIFEST);

const wsPathRegex = /\/ws\/([A-Za-z0-9_-]+)\/(.*)/

console.log("Hello again from sw")

registerRoute(
    ({ url, request, event }) => {
        const isSameHost = url.host === self.location.host
        if (!isSameHost) return false;
        const wsMatch = url.pathname.match(wsPathRegex);
        return !!(wsMatch && wsMatch[1] && wsMatch[2] && wsMatch[2].match(/.(jpe?g|png|svg|gif|bmp)$/));
    },
    async ({ url, request, event, params }) => {
        const wsMatch = url.pathname.match(wsPathRegex);
        if (!wsMatch) return mkNotFound();
        const wsId = wsMatch[1]
        const parts = wsMatch[2].split("/")
        const dirParts = parts.slice(0, -1)
        const fileName = parts.at(parts.length - 1)
        if (!wsId || !fileName || parts.length < 2) {
            return mkNotFound();
        }
        const dir = await get(workspaceRootKey);
        if (!(dir instanceof FileSystemDirectoryHandle))
            return mkNotFound();
        let curDir = dir;
        try {
            for (const dirPart of dirParts) {
                curDir = await dir.getDirectoryHandle(dirPart)
            }
            const fileHandle = await curDir.getFileHandle(fileName)
            const file = await fileHandle.getFile()
            return new Response(file, {
                status: 200,
                headers: {
                    'Content-Type': file.type,
                    'Content-Length': file.size.toString(),
                    'Content-Disposition': `inline; filename="${fileName}"`
                }
            });
        } catch (e) {
            console.error("Failed to access file", url, e)
        }
        return mkNotFound();
    }
)

const mkNotFound = () => new Response('Not Found', {
    status: 404,
    statusText: 'Not Found',
    headers: {
        'Content-Type': 'text/plain'
    }
})
