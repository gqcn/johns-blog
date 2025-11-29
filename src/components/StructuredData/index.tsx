import React from 'react';
import Head from '@docusaurus/Head';

interface StructuredDataProps {
    data: object;
}

/**
 * Component for adding JSON-LD structured data to pages
 * Helps search engines better understand the content
 */
export default function StructuredData({ data }: StructuredDataProps): JSX.Element {
    return (
        <Head>
            <script type="application/ld+json">
                {JSON.stringify(data)}
            </script>
        </Head>
    );
}
