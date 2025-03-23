import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';

// @ts-expect-error - Replaced by workbox
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ url, request, event }) => url.pathname.match(/\/nb\//),
    async ({ url, request, event, params }) => {
        return new Response(`Foo`)
    }
)
