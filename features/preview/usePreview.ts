import { useDependencies } from "@/di/DependenciesContext";
import { buildFullHtml } from "@/resources/html_template";
import { useEffect, useState } from "react";

export function usePreview(messageId: string) {
    const { chatsRepository, appGenerationRepository } = useDependencies();
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const artifacts = await chatsRepository.getArtifacts(messageId);
                const generatedApp = await appGenerationRepository.getGeneratedApp(artifacts.map(artifact => ({ id: artifact.id, kind: artifact.kind })));

                const htmlArtifact = generatedApp.find(artifact => artifact.kind === 'html');
                const cssArtifact = generatedApp.find(artifact => artifact.kind === 'css');
                const jsArtifact = generatedApp.find(artifact => artifact.kind === 'js');

                if (htmlArtifact && cssArtifact && jsArtifact) {
                    const html = buildFullHtml(htmlArtifact.content, cssArtifact.content, jsArtifact.content);
                    setHtml(html);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message ?? 'Failed to load preview');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [messageId, chatsRepository, appGenerationRepository]);

    return { html, loading, error };
}