/**
 * @author TristanVALCKE / https://github.com/Itee
 */
/* global QUnit */

import { WebGLRenderLists, WebGLRenderList } from '../../../../../src/renderers/webgl/WebGLRenderLists';
import { Camera } from '../../../../../src/cameras/Camera';
import { Scene } from '../../../../../src/scenes/Scene';

export default QUnit.module( 'Renderers', () => {

	QUnit.module( 'WebGL', () => {

		QUnit.module( 'WebGLRenderLists', () => {

			// PUBLIC STUFF
			QUnit.test( "get", ( assert ) => {

				var renderLists = new WebGLRenderLists();
				var sceneA = new Scene();
				var sceneB = new Scene();
				var cameraA = new Camera();
				var cameraB = new Camera();

				var listAA = renderLists.get( sceneA, cameraA );
				var listAB = renderLists.get( sceneA, cameraB );
				var listBA = renderLists.get( sceneB, cameraA );

				assert.propEqual( listAA, new WebGLRenderList(), "listAA is type of WebGLRenderList." );
				assert.propEqual( listAB, new WebGLRenderList(), "listAB is type of WebGLRenderList." );
				assert.ok( listAA !== listAB, "Render lists for camera A and B with same scene are different." );
				assert.ok( listAA !== listBA, "Render lists for scene A and B with same camera are different." );
				assert.ok( listAA === renderLists.get( sceneA, cameraA ), "The same list is returned when called with the same scene, camera." );

			} );

			QUnit.test( "dispose", ( assert ) => {

				var renderLists = new WebGLRenderLists();
				var scene = new Scene();
				var camera = new Camera();

				var list1 = renderLists.get( scene, camera );

				scene.dispose()

				var list2 = renderLists.get( scene, camera );

				assert.ok( list1 !== list2, "New list should be different after disposing of the scene." );

			} );

		} );


		QUnit.module( 'WebGLRenderList', () => {

			QUnit.test( 'init', ( assert ) => {

				var list = new WebGLRenderList();

				assert.ok( list.transparent.length === 0, 'Transparent list defaults to length 0.' );
				assert.ok( list.opaque.length === 0, 'Opaque list defaults to length 0.' );

				list.push( {}, {}, { transparent: true }, 0, 0, {} );
				list.push( {}, {}, { transparent: false }, 0, 0, {} );

				assert.ok( list.transparent.length === 1, 'Transparent list is length 1 after adding transparent item.' );
				assert.ok( list.opaque.length === 1, 'Opaque list list is length 1 after adding opaque item.' );

				list.init();

				assert.ok( list.transparent.length === 0, 'Transparent list is length 0 after calling init.' );
				assert.ok( list.opaque.length === 0, 'Opaque list list is length 0 after calling init.' );

			} );

			QUnit.test( 'push', ( assert ) => {

				var list = new WebGLRenderList();
				var objA = { id: 'A', renderOrder: 0 };
				var matA = { transparent: true, program: { id: 1 } };
				var geoA = {};

				var objB = { id: 'B', renderOrder: 0 };
				var matB = { transparent: true, program: { id: 2 } };
				var geoB = {};

				var objC = { id: 'C', renderOrder: 0 };
				var matC = { transparent: false, program: { id: 3 } };
				var geoC = {};

				var objD = { id: 'D', renderOrder: 0 };
				var matD = { transparent: false, program: { id: 4 } };
				var geoD = {};

				list.push( objA, geoA, matA, 0, 0.5, {} );
				assert.ok( list.transparent.length === 1, 'Transparent list is length 1 after adding transparent item.' );
				assert.ok( list.opaque.length === 0, 'Opaque list list is length 0 after adding transparent item.' );
				assert.deepEqual(
					list.transparent[ 0 ],
					{
						id: 'A',
						object: objA,
						geometry: geoA,
						material: matA,
						program: matA.program,
						groupOrder: 0,
						renderOrder: 0,
						z: 0.5,
						group: {}
					},
					'The first transparent render list item is structured correctly.'
				);

				list.push( objB, geoB, matB, 1, 1.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding second transparent item.' );
				assert.ok( list.opaque.length === 0, 'Opaque list list is length 0 after adding second transparent item.' );
				assert.deepEqual(
					list.transparent[ 1 ],
					{
						id: 'B',
						object: objB,
						geometry: geoB,
						material: matB,
						program: matB.program,
						groupOrder: 1,
						renderOrder: 0,
						z: 1.5,
						group: {}
					},
					'The second transparent render list item is structured correctly.'
				);

				list.push( objC, geoC, matC, 2, 2.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding first opaque item.' );
				assert.ok( list.opaque.length === 1, 'Opaque list list is length 1 after adding first opaque item.' );
				assert.deepEqual(
					list.opaque[ 0 ],
					{
						id: 'C',
						object: objC,
						geometry: geoC,
						material: matC,
						program: matC.program,
						groupOrder: 2,
						renderOrder: 0,
						z: 2.5,
						group: {}
					},
					'The first opaque render list item is structured correctly.'
				);

				list.push( objD, geoD, matD, 3, 3.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding second opaque item.' );
				assert.ok( list.opaque.length === 2, 'Opaque list list is length 2 after adding second opaque item.' );
				assert.deepEqual(
					list.opaque[ 1 ],
					{
						id: 'D',
						object: objD,
						geometry: geoD,
						material: matD,
						program: matD.program,
						groupOrder: 3,
						renderOrder: 0,
						z: 3.5,
						group: {}
					},
					'The second opaque render list item is structured correctly.'
				);

			} );

			QUnit.test( 'unshift', ( assert ) => {

				var list = new WebGLRenderList();
				var objA = { id: 'A', renderOrder: 0 };
				var matA = { transparent: true, program: { id: 1 } };
				var geoA = {};

				var objB = { id: 'B', renderOrder: 0 };
				var matB = { transparent: true, program: { id: 2 } };
				var geoB = {};

				var objC = { id: 'C', renderOrder: 0 };
				var matC = { transparent: false, program: { id: 3 } };
				var geoC = {};

				var objD = { id: 'D', renderOrder: 0 };
				var matD = { transparent: false, program: { id: 4 } };
				var geoD = {};

				list.unshift( objA, geoA, matA, 0, 0.5, {} );
				assert.ok( list.transparent.length === 1, 'Transparent list is length 1 after adding transparent item.' );
				assert.ok( list.opaque.length === 0, 'Opaque list list is length 0 after adding transparent item.' );
				assert.deepEqual(
					list.transparent[ 0 ],
					{
						id: 'A',
						object: objA,
						geometry: geoA,
						material: matA,
						program: matA.program,
						groupOrder: 0,
						renderOrder: 0,
						z: 0.5,
						group: {}
					},
					'The first transparent render list item is structured correctly.'
				);

				list.unshift( objB, geoB, matB, 1, 1.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding second transparent item.' );
				assert.ok( list.opaque.length === 0, 'Opaque list list is length 0 after adding second transparent item.' );
				assert.deepEqual(
					list.transparent[ 0 ],
					{
						id: 'B',
						object: objB,
						geometry: geoB,
						material: matB,
						program: matB.program,
						groupOrder: 1,
						renderOrder: 0,
						z: 1.5,
						group: {}
					},
					'The second transparent render list item is structured correctly.'
				);

				list.unshift( objC, geoC, matC, 2, 2.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding first opaque item.' );
				assert.ok( list.opaque.length === 1, 'Opaque list list is length 1 after adding first opaque item.' );
				assert.deepEqual(
					list.opaque[ 0 ],
					{
						id: 'C',
						object: objC,
						geometry: geoC,
						material: matC,
						program: matC.program,
						groupOrder: 2,
						renderOrder: 0,
						z: 2.5,
						group: {}
					},
					'The first opaque render list item is structured correctly.'
				);

				list.unshift( objD, geoD, matD, 3, 3.5, {} );
				assert.ok( list.transparent.length === 2, 'Transparent list is length 2 after adding second opaque item.' );
				assert.ok( list.opaque.length === 2, 'Opaque list list is length 2 after adding second opaque item.' );
				assert.deepEqual(
					list.opaque[ 0 ],
					{
						id: 'D',
						object: objD,
						geometry: geoD,
						material: matD,
						program: matD.program,
						groupOrder: 3,
						renderOrder: 0,
						z: 3.5,
						group: {}
					},
					'The second opaque render list item is structured correctly.'
				);

			} );

			QUnit.test( 'sort', ( assert ) => {

				var list = new WebGLRenderList();
				var items = [ { id: 4 }, { id: 5 }, { id: 2 }, { id: 3 } ];

				items.forEach( item => {

					list.push( item, {}, { transparent: true }, 0, 0, {} );
					list.push( item, {}, { transparent: false }, 0, 0, {} );

				} );

				list.sort( ( a, b ) => a.id - b.id, ( a, b ) => b.id - a.id );

				assert.deepEqual(
					list.opaque.map( item => item.id ),
					[ 2, 3, 4, 5 ],
					'The opaque sort is applied to the opaque items list.'
				);

				assert.deepEqual(
					list.transparent.map( item => item.id ),
					[ 5, 4, 3, 2 ],
					'The transparent sort is applied to the transparent items list.'
				);

			} );

			// QUnit.test( 'finish', ( assert ) => {

			// 	var list = new WebGLRenderList();
			// 	var obj = { id: 'A', renderOrder: 0 };
			// 	var mat = { transparent: false, program: { id: 0 } };
			// 	var geom = {};

			// 	assert.ok( list.renderItems.length === 0, 'Render items length defaults to 0.' );

			// 	list.push( obj, geom, mat, 0, 0, {} );
			// 	list.push( obj, geom, mat, 0, 0, {} );
			// 	list.push( obj, geom, mat, 0, 0, {} );
			// 	assert.ok( list.renderItems.length === 3, 'Render items length expands as items are added.' );

			// 	list.finish();
			// 	assert.deepEqual(
			// 		list.renderItems.map( item => item.object ),
			// 		[ obj, obj, obj ],
			// 		'Render items are not cleaned if they are being used.'
			// 	);
			// 	assert.deepEqual(
			// 		list.renderItems[ 1 ],
			// 		{
			// 			id: 'A',
			// 			object: obj,
			// 			geometry: geom,
			// 			material: mat,
			// 			program: mat.program,
			// 			groupOrder: 0,
			// 			renderOrder: 0,
			// 			z: 0,
			// 			group: {}
			// 		},
			// 		'Unused render item is structured correctly before clearing.'
			// 	);

			// 	list.init();
			// 	list.push( obj, geom, mat, 0, 0, {} );
			// 	assert.ok( list.renderItems.length === 3, 'Render items length does not shrink.' );

			// 	list.finish();
			// 	assert.deepEqual(
			// 		list.renderItems.map( item => item.object ),
			// 		[ obj, null, null ],
			// 		'Render items are cleaned if they are not being used.'
			// 	);

			// 	assert.deepEqual(
			// 		list.renderItems[ 1 ],
			// 		{
			// 			id: null,
			// 			object: null,
			// 			geometry: null,
			// 			material: null,
			// 			program: null,
			// 			groupOrder: 0,
			// 			renderOrder: 0,
			// 			z: 0,
			// 			group: null
			// 		},
			// 		'Unused render item is structured correctly before clearing.'
			// 	);

			// } );

		} );

	} );

} );
