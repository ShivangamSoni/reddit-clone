import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    {
        ssr: false,
    }
);

const style = {
    paragraph: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    },
};

const renderers = {
    image: ImageRenderer,
    code: CodeRenderer,
};

interface Props {
    content: any;
}

export default function EditorOutput({ content }: Props) {
    return (
        // @ts-expect-error
        <Output
            data={content}
            style={style}
            className="text-sm"
            renderers={renderers}
        />
    );
}

function CodeRenderer({ data }: any) {
    return (
        <pre className="bg-gray-800 rounded-md p-4">
            <code className="text-gray-100 text-sm">{data.code}</code>
        </pre>
    );
}

function ImageRenderer({ data }: any) {
    const src = data.file.url;

    return (
        <div className="relative w-full min-h-[15rem]">
            <Image
                src={src}
                alt={data.caption ?? "Image"}
                fill
                className="object-contain"
            />
        </div>
    );
}
