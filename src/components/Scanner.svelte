<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { BarcodeDetector } from "barcode-detector";
    import { CameraOff, Flashlight, FlashlightOff, ZoomIn, ZoomOut } from "lucide-svelte";
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";

    let { onScan }: { onScan: (code: string) => void } = $props()

    const barcodeDetector: BarcodeDetector = new BarcodeDetector({ formats: ["any"] });

    let video: HTMLVideoElement;
    let stream: MediaStream | null = null;
    let scanInterval: NodeJS.Timeout | null = null;
    let codes: string[] = $state([]);
    let cameraDenied: boolean = $state(false);
    let hasZoom: boolean = $state(false);
    let zoomSteps: number[] = [0.5, 1, 1.5, 2];
    let currentZoom: number = $state(1);
    let hasTorch: boolean = $state(false);
    let torchEnabled: boolean = $state(false);

    async function setZoom(zoomIn: boolean) {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        if (track.getCapabilities().zoom) {
            const { max, min } = track.getCapabilities().zoom;
            zoomIn ? currentZoom++ : currentZoom--;
            currentZoom = Math.max(0, Math.min(currentZoom, zoomSteps.length - 1));
            await track.applyConstraints({
                advanced: [{ zoom: Math.max(min, Math.min(zoomSteps[currentZoom], max)) }]
            });
        }
    }

    async function toggleTorch() {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        if (track.getCapabilities().torch) {
            torchEnabled = !torchEnabled;
            await track.applyConstraints({ advanced: [{ torch: torchEnabled }] });
        }
    }

    async function startStream() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                }
            });
            video.srcObject = stream;
            const track = stream.getVideoTracks()[0];
            hasTorch = track.getCapabilities().torch !== undefined;
            hasZoom = track.getCapabilities().zoom !== undefined;
        } catch (err) {
            console.error("Error accessing camera: ", err);
            cameraDenied = true;
        }
        scanInterval = setInterval(scanFrame, 10);
    }

    async function stopStream() {
        if (!stream) return;
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
        video.srcObject = null;
        if (scanInterval) clearInterval(scanInterval);
    }

    async function scanFrame() {
        if (!stream || !video || video.readyState !== video.HAVE_ENOUGH_DATA) return;
        const detectedCodes = await barcodeDetector.detect(video);
        detectedCodes.forEach((code: DetectedBarcode) => {
            if (!code.rawValue.startsWith(env.PUBLIC_QR_PREFIX)) return
            if (codes.includes(code.rawValue)) return;
            codes.push(code.rawValue);
            onScan(code.rawValue.replace(env.PUBLIC_QR_PREFIX, ""));
        });
    }

    onMount(() => {
        if (navigator.mediaDevices) {
            startStream();
        } else {
            console.error("Camera not supported in this browser.");
            cameraDenied = true;
        }
    });
</script>

<div class="relative size-full flex flex-col">
    <video class="size-full object-cover" bind:this={video} autoplay muted playsinline></video>
    {#if cameraDenied}
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-red-500/25">
            <CameraOff class="size-32 text-white opacity-50" />
        </div>
    {:else}
        <div class="absolute right-4 bottom-4 flex flex-row items-center gap-2">
            {#if hasZoom}
                <Button variant="outline" size="icon" onclick={() => setZoom(true)} disabled={currentZoom >= zoomSteps.length - 1}>
                    <ZoomIn />
                </Button>
                <Button variant="outline" size="icon" onclick={() => setZoom(false)} disabled={currentZoom <= 0}>
                    <ZoomOut />
                </Button>
            {/if}
            {#if hasTorch}
                <Button variant="outline" size="icon" onclick={toggleTorch}>
                    {#if torchEnabled}
                        <FlashlightOff />
                    {:else}
                        <Flashlight />
                    {/if}
                </Button>
            {/if}
        </div>
    {/if}
</div>
