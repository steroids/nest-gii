import * as React from 'react';
import {useBem, useFetch, useSelector} from '@steroidsjs/core/hooks';
import {
    Button, CheckboxListField,
    DropDownField,
    FieldList,
    Form,
    InputField
} from '@steroidsjs/core/ui/form';
import {useMemo} from 'react';
import {IBackendRepository} from '../../types/IBackendRepository';
import FieldListView from '../../shared/FieldListView';
import FieldListItemView from '../../shared/FieldListItemView';
import {getRouteParam} from '@steroidsjs/core/reducers/router';
import FieldParamsList from '../ModelFormPage/views/FieldParamsList';
import './ModelUpdateFormPage.scss';
import {ENTITY_FORM_ID} from '../ModelFormPage/ModelFormPage';

export const ENTITY_UPDATE_FORM_ID = 'UpdateEntityForm';

export default function ModelUpdateFormPage() {
    const bem = useBem('ModelUpdateFormPage');
    const projectName = useSelector(state => getRouteParam(state, 'projectName'));
    const repositoryUid = useSelector(state => getRouteParam(state, 'repositoryUid'));
    const modelName = useSelector(state => getRouteParam(state, 'modelName'));
    const fields = useSelector(state => state.auth?.data?.fields);

    const modelFetchConfig = useMemo(() => modelName && ({
        url: `/api/v1/project/${projectName}/repository/${repositoryUid}/entity/${modelName}`,
        method: 'get',
    }), [modelName]);

    const {data, isLoading}= useFetch(modelFetchConfig);

    const repositoryFetchConfig = useMemo(() => repositoryUid && ({
        url: `/api/v1/project/${projectName}/repository/${repositoryUid}`,
        method: 'get',
    }), [repositoryUid]);

    const {data: repository}= useFetch(repositoryFetchConfig);

    const modulesEnum = useMemo(() => (repository?.modules || [])?.map(module => ({
        label: module.name,
        id: module.name,
    })), [repository]);

    const fieldsEnum = useMemo(() => (fields || [])?.map(field => ({
        label: field.name,
        id: field.name,
    })), [repository]);

    const exportDtoEnum = ['addToSaveDto', 'addToSearchDto', 'addToDetailSchema', 'addToSearchSchema'].map(item => ({
        label: item.replace('addTo', ''),
        id: item,
    }));

    if (isLoading) {
        return null;
    }

    console.log(data);

    return (
        <div className={bem.block()}>
            <Form
                formId={ENTITY_FORM_ID}
                action='/api/v1/entity'
                initialValues={data}
                useRedux
            >
                <div className='col-lg-3 col-md-4 col-sm-6'>
                    <DropDownField
                        label={__('Модуль')}
                        attribute='moduleName'
                        items={modulesEnum}
                        required
                    />
                    <InputField
                        label={__('Название модели')}
                        attribute='entityName'
                        required
                    />
                </div>
                <FieldList
                    attribute='fields'
                    label={__('Поля')}
                    view={FieldListView}
                    itemView={FieldListItemView}
                    items={[
                        {
                            attribute: 'name',
                            label: __('Название'),
                            component: InputField,
                            required: true,
                            size: 'sm',
                        },
                        {
                            attribute: 'type',
                            label: __('Тип'),
                            items: fieldsEnum,
                            autoComplete: true,
                            required: true,
                            component: DropDownField,
                            size: 'sm',
                        },
                        {
                            attribute: 'addToDto',
                            label: __('Добавить в:'),
                            items: exportDtoEnum,
                            component: CheckboxListField,
                            size: 'sm',
                            disabled: true,
                        },
                        {
                            component: ({prefix}) => (
                                <FieldParamsList
                                    attribute={`${prefix}.params`}
                                    fields={fields}
                                    project={repository}
                                    fieldKey='params'
                                    label={__('Параметры')}
                                />
                            ),
                        },
                        {
                            component: ({prefix}) => (
                                <FieldParamsList
                                    attribute={`${prefix}.additionalParams`}
                                    fields={fields}
                                    project={repository}
                                    fieldKey='additionalParams'
                                    label={__('Дополнительно')}
                                />
                            ),
                        },
                    ]}
                />
                <Button
                    type='submit'
                    label={__('Сохранить')}
                />
            </Form>
        </div>
    );
}
