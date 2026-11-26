import { Suspense } from "react";
import { SliceSimulator, SliceSimulatorParams, getSlices } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";

import { components } from "../../slices";

// cacheComponents: searchParams читаются только внутри <Suspense>
export default function SliceSimulatorPage({ searchParams }: SliceSimulatorParams) {
	return (
		<Suspense>
			<Simulator searchParams={searchParams} />
		</Suspense>
	);
}

async function Simulator({ searchParams }: SliceSimulatorParams) {
	const { state } = await searchParams;
	const slices = getSlices(state);

	return (
		<SliceSimulator>
			<SliceZone slices={slices} components={components} />
		</SliceSimulator>
	);
}
