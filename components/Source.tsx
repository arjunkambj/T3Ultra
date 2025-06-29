import Link from "next/link";
import { Image } from "@heroui/image";
import { Tooltip } from "@heroui/tooltip";

export default function Source({ source }: { source: any[] }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-700/50 p-2 px-3">
      <div className="text-sm font-medium text-neutral-300">Sources:</div>
      <div className="flex flex-wrap gap-2">
        {source.map((item: any) => {
          const source = item.source || item;
          const favicon = item.favicon || source.favicon;

          return (
            <Tooltip
              key={`source-${source.id}`}
              content={source.title || new URL(source.url).hostname}
              placement="top"
            >
              <Link href={source.url} rel="noopener noreferrer" target="_blank">
                <Image
                  alt={source.title}
                  className="h-4 w-4"
                  height={16}
                  src={favicon}
                  width={16}
                />
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
