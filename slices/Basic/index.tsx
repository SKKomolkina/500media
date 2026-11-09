import { Content } from "@prismicio/client";
import { PrismicImage, SliceComponentProps } from "@prismicio/react";

export type BasicProps = SliceComponentProps<Content.BasicSlice>;

export default function Basic({ slice }: BasicProps) {
	const size = slice.primary.size || "M";

	const sizeClasses = {
		S: "max-w-xs",
		M: "max-w-sm",
		L: "max-w-md",
	}[size];

	return (
		<section className="py-8 px-4">
			<div className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${sizeClasses}`}>

				<div className="relative w-full aspect-square bg-gray-200">
					{slice.primary.image && (
						<PrismicImage
							field={slice.primary.image}
							className="w-full h-full object-cover"
						/>
					)}
					<div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
						▶
					</div>
				</div>

				<div className="p-4 flex flex-col justify-between">
					<h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">
						{slice.primary.title ? slice.primary.title : "Title"}
					</h3>

					<div className="flex items-center gap-4 text-xs text-gray-500">
						<span className="flex items-center gap-1">❤️ 0</span>
						<span className="flex items-center gap-1">↗ 0</span>
					</div>
				</div>

			</div>
		</section>
	);
}
